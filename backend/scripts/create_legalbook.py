from backend.util.links import links
from backend.main import LegalAgentMain, RuleBook, CrawlerServiceMain
from backend.agents.analyzer_agent import AnalyzerAgent
import asyncio
import yaml


async def process_legal_sources():
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


async def analyze_user_question(question: str, jurisdiction: str = None):
    """Process a user's legal question using the analyzer agent"""
    analyzer = AnalyzerAgent()
    result = await analyzer.analyze_question(question, jurisdiction)
    return result


async def main():
    """Simple interactive legal analysis"""
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--create":
        await process_legal_sources()
    else:
        question = input("Enter your legal question: ").strip()
        jurisdiction = input(
            "Enter jurisdiction (optional, press Enter to skip): "
        ).strip() or None

        print("\nAnalyzing...")
        result = await analyze_user_question(question, jurisdiction)

        if result["status"] == "success":
            print("\nAnalysis Result:")
            print("--------------")
            print(result["analysis"])
        else:
            print(f"\nError: {result['error']}")


if __name__ == "__main__":
    asyncio.run(main())
