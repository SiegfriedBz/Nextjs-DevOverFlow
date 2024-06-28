/* eslint-disable camelcase */
import type { IUserDocument } from "@/models/user.model"
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/server-actions/user.actions"
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { Webhook } from "svix"

export type TMutateUserData = {
  clerkId: string
  name: string
  userName: string
  email: string
  picture: string
}

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    )
  }

  // Get the headers
  const headerPayload = headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log("Webhook body:", body)

  if (evt.type === "user.created") {
    console.log("===== CLERK - user.created")
    const userData = formatUserData(evt.data) as TMutateUserData

    const newUser: Error | IUserDocument | null = await createUserAction({
      userData,
    })

    if (newUser instanceof Error || !newUser?._id) {
      console.log("===== CLERK - user.created - ERROR", newUser)
      return new Response("Error occured", {
        status: 400,
      })
    }
  }

  if (evt.type === "user.updated") {
    console.log("===== CLERK - user.updated")
    const { clerkId, ...rest } = formatUserData(evt.data) as TMutateUserData

    const updatedUser: Error | IUserDocument | null = await updateUserAction({
      filter: { clerkId },
      data: rest,
    })

    if (updatedUser instanceof Error || !updatedUser?._id) {
      console.log("===== CLERK - user.updated - ERROR", updatedUser)
      return new Response("Error occured", {
        status: 400,
      })
    }
  }

  if (evt.type === "user.deleted") {
    console.log("===== CLERK - user.deleted")
    const { id } = evt.data

    const result = await deleteUserAction({
      filter: { clerkId: id },
    })

    if (result instanceof Error) {
      console.log("===== CLERK - user.updated - ERROR", result)
      return new Response("Error occured", {
        status: 400,
      })
    }
  }

  return new Response("", { status: 200 })
}

const formatUserData = (clerckData: UserJSON) => {
  const { id, email_addresses, first_name, last_name, username, image_url } =
    clerckData // clerckUser
  const userEmail = email_addresses?.at(0)?.email_address as string
  const name = `${first_name}${last_name ? ` ${last_name}` : ""}`

  const userData: TMutateUserData = {
    clerkId: id,
    name,
    userName: username || name,
    email: userEmail,
    picture: image_url,
  }

  return userData
}
