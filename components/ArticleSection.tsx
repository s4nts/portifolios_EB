import Image from 'next/image';

interface ArticleSectionProps {
  heading: string;
  body: string;
  image: string;
}

export default function ArticleSection({
  heading,
  body,
  image,
}: ArticleSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{heading}</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">{body}</p>
      <div className="flex justify-center">
        <div className="relative w-full md:w-[320px] h-[200px] md:h-[200px]">
          <Image
            src={image}
            alt={heading}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        </div>
      </div>
    </section>
  );
}
