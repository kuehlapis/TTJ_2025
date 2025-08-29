from backend.util.links import links
from backend.main import LegalAgentMain, RuleBook, CrawlerMain
import asyncio
import yaml


async def main():
    merged = {"geo": {}}

    for source, url in links.items():
        print(f"Processing {source}: {url} ...")
        markdown = await CrawlerMain.url_to_markdown(url)
        if not markdown:
            print(f"Failed to get markdown for {url}")
            continue
        yaml_str = LegalAgentMain.extract_legals(markdown)

        try:
            data = yaml.safe_load(yaml_str)
        except Exception as e:
            print(f"YAML parse error for {url}: {e}")
            continue

        region_name = data.get("source", {}).get("jurisdiction")
        if not region_name:
            print(f"No jurisdiction found for {url}")
            continue

        if region_name not in merged["geo"]:
            merged["geo"][region_name] = {}

        for key, value in data.items():
            merged["geo"][region_name][key] = value

    RuleBook.save_rulebook(merged)
    print("Saved segregated YAML")


if __name__ == "__main__":
    asyncio.run(main())
