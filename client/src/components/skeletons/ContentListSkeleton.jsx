import ContentCardSkeleton from './ContentCardSkeleton';

const ContentListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ContentCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ContentListSkeleton;

