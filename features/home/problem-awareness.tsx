import Link from "next/link";

const ProblemAwareness = () => {
  return (
    <section
      aria-labelledby="featured-blogs-heading"
      className="home-features bg-primary py-20 px-40"
    >
      <div className="flex gap-5 flex-col justify-center items-center text-center">
        <p className="text-muted font-semibold uppercase text-sm">Problem Awareness </p>
        <div>
          <p className="text-4xl font-extrabold">When something happens online,</p>
          <p className="text-4xl text-secondary font-extrabold">you don’t have to face it alone.</p>
        </div>
        <Link href="/companion" className="flex items-center gap-2 text-sm font-medium text-primary bg-secondary px-8 py-3 rounded-sm hover:bg-secondary/90 transition-colors">
          Chat with DigiSafe AI
        </Link>
      </div>
    </section>
  )
}

export default ProblemAwareness;