"use client";

import ArticleSection from "./ArticleSection";

interface Section {
  heading: string;
  body: string;
  image: string | string[];
}

interface ArticleContentProps {
  sections: Section[];
  slug: string;
}

export default function ArticleContent({
  sections,
  slug,
}: ArticleContentProps) {
  return (
    <div className="w-full">
      <div>
        {sections.map((section, index) => (
          <div key={`${slug}-section-${index}`}>
            <ArticleSection
              heading={section.heading}
              body={section.body}
              image={section.image}
              isLast={index === sections.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
