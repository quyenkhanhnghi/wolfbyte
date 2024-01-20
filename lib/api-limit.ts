import { auth, currentUser } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_API } from "@/constant";

export const increaseAPILimit = async () => {
  const { userId } = auth();
  const currentUserLogin = await currentUser();

  if (!userId || !currentUserLogin) {
    return;
  }

  const user = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (user) {
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: user.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
    // await prismadb.user.create({
    //   data: {
    //     userId: userId,
    //     email: currentUserLogin.emailAddresses[0].emailAddress,
    //     generatedContents: {},
    //     userApiLimit: {},
    //     userSubscription: {},
    //     name: "hi",
    //   },
    // });
  }
};

export const checkUserAPILimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  try {
    const userApiUsage = await prismadb.userApiLimit.findUnique({
      where: { userId },
    });
    return !userApiUsage || userApiUsage.count < MAX_FREE_API;
  } catch (error) {
    console.error("Error checking API limit:", error);
    return false;
  }
};

export const getUserAPIUsage = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  try {
    const userApiUsage = await prismadb.userApiLimit.findUnique({
      where: { userId },
    });
    return userApiUsage ? userApiUsage.count : 0;
  } catch (error) {
    console.error("Error getting API limit:", error);
    return 0;
  }
};
