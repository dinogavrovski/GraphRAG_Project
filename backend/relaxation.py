import re

def relax_numeric_ranges(cypher_query, percentage_increase=10):
    """Expands BETWEEN ranges by a percentage."""
    def expand(match):
        min_val = int(match.group(1))
        max_val = int(match.group(2))
        delta = int((max_val - min_val) * (percentage_increase / 100))
        new_min = max(0, min_val - delta)
        new_max = max_val + delta
        return f"BETWEEN {new_min} AND {new_max}"
    return re.sub(r'BETWEEN (\d+) AND (\d+)', expand, cypher_query)

def drop_least_important_filters(cypher_query):
    filters = ['c.color =', 'c.gearbox =', 'c.fuel =', 'c.car_body =']
    for f in filters:
        if f in cypher_query:
            cypher_query = re.sub(r'\s*' + re.escape(f) + r'.*?\n', '', cypher_query)
            return cypher_query, f"Filter dropped: {f}"
    return cypher_query, None

def apply_fuzzy_matching(cypher_query):
    cypher_query = re.sub(r"c\.color = '(\w+)'", r"c.color CONTAINS '\1'", cypher_query)
    cypher_query = re.sub(r"c\.fuel = '(\w+)'", r"c.fuel CONTAINS '\1'", cypher_query)
    cypher_query = re.sub(r"c\.gearbox = '(\w+)'", r"c.gearbox CONTAINS '\1'", cypher_query)
    cypher_query = re.sub(r"c\.car_body = '(\w+)'", r"c.car_body CONTAINS '\1'", cypher_query)
    return cypher_query, "Fuzzy matching applied"

def sanitize_query(query: str) -> str:
    query = re.sub(r'\bAND\s+AND\b', 'AND', query)
    query = re.sub(r'\s+AND\s*$', '', query)
    query = re.sub(r'\s+', ' ', query)
    return query.strip()

def search_until_match(cypher_query, session, numeric_fields=['kilometers'], max_iterations=20, step_pct=5):
    """
    Incrementally relax numeric ranges until at least one match is found.
    - numeric_fields: list of fields to relax (e.g., ['kilometers', 'engine_power'])
    - step_pct: % increase per iteration
    """
    applied_steps = []
    iteration = 0
    relaxed_query = cypher_query

    while iteration < max_iterations:
        relaxed_query = sanitize_query(relaxed_query)
        result = session.run(relaxed_query)
        data = [r.data() for r in result]
        if data:
            return data, applied_steps

        # Relax numeric ranges
        for pct in numeric_fields:
            relaxed_query = relax_numeric_ranges(relaxed_query, step_pct)
            applied_steps.append(f"{pct} relaxed by ±{step_pct}% (iteration {iteration+1})")

        # Drop filters progressively if still empty
        relaxed_query, step_info = drop_least_important_filters(relaxed_query)
        if step_info:
            applied_steps.append(step_info)

        # Apply fuzzy matching if still empty
        relaxed_query, step_info = apply_fuzzy_matching(relaxed_query)
        applied_steps.append(step_info)

        iteration += 1
        step_pct += 5  # progressively increase the relaxation %

    # Return whatever we have (could still be empty)
    return data, applied_steps
