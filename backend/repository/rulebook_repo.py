import yaml


class RulebookRepository:
    def __init__(self, path="backend/agents/rules/legalbook.yaml"):
        self.path = path

    def load_rulebook(self):
        with open(self.path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    def save_rulebook(self, data):
        with open(self.path, "w", encoding="utf-8") as f:
            yaml.dump(data, f, allow_unicode=True, sort_keys=False)
