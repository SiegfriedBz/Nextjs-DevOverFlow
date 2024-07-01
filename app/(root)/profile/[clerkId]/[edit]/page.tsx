import ProfileForm from "@/components/forms/ProfileForm"
import { TMutateUserInput } from "@/lib/zod/user.zod"
import { getUserForEdit } from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { toast } from "sonner"

type TProps = {
  params: { clerkId: string }
}
const EditProfilePage = async ({ params }: TProps) => {
  const { clerkId: userClerkId } = params

  // Get current clerk user
  const currentClerkUser = await currentUser()

  if (!currentClerkUser) {
    toast.info("Please sign in")
    redirect("/sign-in")
  }

  // check authorization
  const isCurrentUserProfile = currentClerkUser.id === userClerkId

  if (!isCurrentUserProfile) {
    toast.warning("You can only update your own profile")
    redirect("/community")
  }

  const userData = await getUserForEdit({ filter: { clerkId: userClerkId } })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Your Profile</h1>
      <div className="mt-9">
        <ProfileForm
          userClerkId={userClerkId}
          userData={userData as TMutateUserInput}
        />
      </div>
    </>
  )
}

export default EditProfilePage
