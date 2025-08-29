from backend.service.ocr_service import OCRService
from backend.util.links import links
from backend.agents.legal_agent import LegalAgent
import asyncio
import yaml

async def main():
    merged = {
        "version": "1.0",
        "sources": {}
    }

    agent = LegalAgent()

    for source, url in links.items():
        print(f"Processing {source}: {url} ...")
        markdown = await OCRService.url_to_markdown(url)
        if not markdown:
            print(f"Failed to get markdown for {url}")
            continue
        yaml_str = agent.extract_legals(markdown)
        try:
            data = yaml.safe_load(yaml_str)
        except Exception as e:
            print(f"YAML parse error for {url}: {e}")
            continue

        # Store all data under this source
        merged["sources"][source] = {"url": url}
        for key, value in data.items():
            merged["sources"][source][key] = value

    # Write segregated YAML to legalbook.yaml
    out_path = "backend/agents/rules/legalbook.yaml"
    with open(out_path, "w", encoding="utf-8") as f:
        yaml.dump(merged, f, allow_unicode=True, sort_keys=False)
    print(f"Saved segregated YAML to {out_path}")

if __name__ == "__main__":
    asyncio.run(main())