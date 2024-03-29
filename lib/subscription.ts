import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_400;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceid: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const userIsValid =
    userSubscription.stripePriceid &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!userIsValid;
};
