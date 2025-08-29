from backend.util.links import links
from backend.main import LegalAgentMain, RuleBook, CrawlerServiceMain
import asyncio
import yaml


async def main():
    merged = {"version": "1.0", "sources": {}}

    for source, url in links.items():
        print(f"Processing {source}: {url} ...")
        markdown = await CrawlerServiceMain.url_to_markdown(url)
        if not markdown:
            print(f"Failed to get markdown for {url}")
            continue
        yaml_str = LegalAgentMain.extract_legals(markdown)
        try:
            data = yaml.safe_load(yaml_str)
        except Exception as e:
            print(f"YAML parse error for {url}: {e}")
            continue

        # Store all data under this source
        merged["sources"][source] = {"url": url}
        for key, value in data.items():
            merged["sources"][source][key] = value

    RuleBook.save_rulebook(merged)
    print("Saved segregated YAML")


if __name__ == "__main__":
    asyncio.run(main())
