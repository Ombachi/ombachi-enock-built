interface EditorialJacketProps {
  title: string;
  category: string;
  className?: string;
}

const EditorialJacket = ({ title, category, className = "" }: EditorialJacketProps) => (
  <div
    className={`relative flex aspect-[2/3] w-full max-w-[19rem] flex-col justify-between overflow-hidden border border-border bg-gradient-to-br from-primary via-primary to-secondary p-7 text-primary-foreground ${className}`}
    aria-label={`Cover design for ${title}`}
  >
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-secondary" />
    <p className="relative text-[10px] font-semibold uppercase tracking-widest opacity-80">Ombachi Editions</p>
    <div className="relative py-8">
      <p className="text-[10px] font-semibold uppercase tracking-widest opacity-75">{category}</p>
      <h3 className="mt-3 font-serif text-2xl leading-tight sm:text-3xl">{title}</h3>
    </div>
    <div className="relative border-t border-primary-foreground/30 pt-4">
      <p className="text-xs uppercase tracking-widest opacity-75">Ombachi Enock</p>
    </div>
  </div>
);

export default EditorialJacket;
