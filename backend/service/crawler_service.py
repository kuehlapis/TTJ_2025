from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator


class CrawlerService:
    @staticmethod
    async def url_to_markdown(url: str) -> str:
        config = CrawlerRunConfig(markdown_generator=DefaultMarkdownGenerator())
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(url, config=config)

            if result.success:
                print("Successfully obtain markdown")
                return result.markdown
            else:
                print("Crawl failed:", result.error_message)
                return ""
