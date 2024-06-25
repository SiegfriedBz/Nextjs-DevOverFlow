import Image from "next/image"
import Link from "next/link"

type TProps = {
  resultType: "question" | "tag"
  paragraphContent: string
  linkLabel: string
  href: string
}
const NoResult = ({
  resultType,
  paragraphContent,
  linkLabel,
  href,
}: TProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center pb-4">
      <Image
        src="/assets/images/light-illustration.png"
        width={270}
        height={220}
        alt="No Result illustration"
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        width={270}
        height={220}
        alt="No Result illustration"
        className="hidden object-contain dark:block"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">
        There is no {resultType} to show
      </h2>
      <p className="body-regular text-dark500_light700 max-w-md text-center">
        {paragraphContent}
      </p>

      <Link
        href={href}
        className="paragraph-medium 
          mt-4
          min-h-10 cursor-pointer 
          rounded-xl
          bg-primary-500 
          px-4 
          py-3 text-light-900 
          hover:bg-primary-500
          dark:text-light-900
        "
      >
        {linkLabel}
      </Link>
    </div>
  )
}

export default NoResult
