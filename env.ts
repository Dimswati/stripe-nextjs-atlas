export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-11-04'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const stripePublishableKey = assertValue(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  'Missing environment variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
)

// export const stripeSecretKey = assertValue(
//   process.env.STRIPE_SECRET_KEY,
//   'Missing environment variable: STRIPE_SECRET_KEY'
// )

export const useCdn = false

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}