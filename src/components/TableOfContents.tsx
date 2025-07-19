import React, { useEffect, useState } from 'react';
import './TableOfContents.scss';
import '../global.scss';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC = () => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = document.querySelectorAll(
      ".main-content h2, .main-content h3, .main-content h4"
    );
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1]);
      const text = heading.textContent || '';
      let id = heading.id;

      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        heading.id = id;
      }

      items.push({ id, text, level });
    });

    setTocItems(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <nav className="table-of-contents">
      <h3 className="toc-title">Sumário</h3>
      <ul className="toc-list">
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={`toc-item toc-level-${item.level} ${
              activeId === item.id ? 'active' : ''
            }`}
          >
            <button
              onClick={() => scrollToHeading(item.id)}
              className="toc-link"
              type="button"
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;