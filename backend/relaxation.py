import re

MAX_NUMERIC_RELAX = 30  # Maximum numeric relaxation in %
NUMERIC_FIELDS = ['kilometers']  # Only kilometers relax, year is strict
CATEGORICAL_FILTERS = ['c.color =', 'c.gearbox =', 'c.fuel =', 'c.car_body =']

def relax_numeric_fields(cypher_query, field='kilometers', pct=10):
    """Relax a numeric field by ±pct%. Year is strict and not included here."""
    # Relax >=
    pattern_gte = fr"({field})\s*>=\s*(\d+)"
    def expand_gte(m):
        val = int(m.group(2))
        delta = max(1, int(val * pct / 100))
        return f"{m.group(1)} >= {val - delta}"
    cypher_query, n = re.subn(pattern_gte, expand_gte, cypher_query)
    if n > 0:
        return cypher_query, f"{field} relaxed (≥ shifted down {pct}%)"

    # Relax <=
    pattern_lte = fr"({field})\s*<=\s*(\d+)"
    def expand_lte(m):
        val = int(m.group(2))
        delta = max(1, int(val * pct / 100))
        return f"{m.group(1)} <= {val + delta}"
    cypher_query, n = re.subn(pattern_lte, expand_lte, cypher_query)
    if n > 0:
        return cypher_query, f"{field} relaxed (≤ shifted up {pct}%)"

    # Relax exact equality
    pattern_eq = fr"({field})\s*=\s*(\d+)"
    def expand_eq(m):
        val = int(m.group(2))
        delta = max(1, int(val * pct / 100))
        low = max(0, val - delta)
        high = val + delta
        return f"{m.group(1)} >= {low} AND {m.group(1)} <= {high}"
    cypher_query, n = re.subn(pattern_eq, expand_eq, cypher_query)
    if n > 0:
        return cypher_query, f"{field} range expanded by ±{pct}%"

    return cypher_query, None

def drop_one_filter(cypher_query):
    """Drop the first categorical filter found."""
    for f in CATEGORICAL_FILTERS:
        pattern = r'\s*' + re.escape(f) + r"\s*['\"]?([^'\"]+)['\"]?\s*(AND)?"
        match = re.search(pattern, cypher_query)
        if match:
            value = match.group(1)
            cypher_query = re.sub(pattern, '', cypher_query, count=1)
            return cypher_query, f"Filter dropped: {f} '{value}'"
    return cypher_query, None

def sanitize_query(query: str) -> str:
    """Clean up duplicate ANDs and whitespace."""
    query = re.sub(r'\bAND\s+AND\b', 'AND', query)
    query = re.sub(r'\s+AND\s*$', '', query)
    query = re.sub(r'\s+', ' ', query)
    return query.strip()

def search_until_match(cypher_query, session, max_iterations=20, step_pct=10):
    """Relax numeric fields, then drop filters until results are found."""
    relaxed_query = cypher_query
    applied_steps = []
    iteration = 0
    pct = step_pct
    filter_index = 0  # Which filter to drop next

    while iteration < max_iterations:
        relaxed_query = sanitize_query(relaxed_query)
        result = session.run(relaxed_query)
        data = [r.data() for r in result]

        if data:
            return data, applied_steps

        # Step 1: Relax numeric fields if below MAX_NUMERIC_RELAX
        if pct <= MAX_NUMERIC_RELAX:
            for field in NUMERIC_FIELDS:
                relaxed_query, step_info = relax_numeric_fields(relaxed_query, field=field, pct=pct)
                if step_info:
                    applied_steps.append(step_info + f" (iteration {iteration+1})")
                    pct += 5
                    iteration += 1
                    continue
            #continue  # retry query after numeric relaxation

        # Step 2: Drop one categorical filter per iteration
        relaxed_query, step_info = drop_one_filter(relaxed_query)
        if step_info:
            relaxed_query, _ =relax_numeric_fields(relaxed_query, field='kilometers', pct=pct-5)
            applied_steps.append(step_info + f" (iteration {iteration+1})")
            iteration += 1
            continue  # retry query after dropping filter

        # Step 3: If no numeric or filters left, exit
        iteration += 1
        break

    return [], applied_steps