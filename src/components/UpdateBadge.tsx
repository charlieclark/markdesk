const badgeStyles: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-badge-new/10', text: 'text-badge-new', label: 'New' },
  improvement: { bg: 'bg-badge-improvement/10', text: 'text-badge-improvement', label: 'Improvement' },
  fix: { bg: 'bg-badge-fix/10', text: 'text-badge-fix', label: 'Fix' },
  'coming-soon': { bg: 'bg-badge-coming-soon/10', text: 'text-badge-coming-soon', label: 'Coming Soon' },
  announcement: { bg: 'bg-badge-announcement/10', text: 'text-badge-announcement', label: 'Announcement' },
};

export default function UpdateBadge({ category }: { category: string }) {
  const style = badgeStyles[category] || badgeStyles.announcement;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
