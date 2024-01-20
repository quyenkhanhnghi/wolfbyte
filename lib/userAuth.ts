import { auth, currentUser } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const checkUser = async () => {
  const { userId } = auth();
  const currentUserLogin = await currentUser();

  if (!userId || !currentUserLogin) {
    return;
  }

  const user = await prismadb.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    await prismadb.user.create({
      data: {
        id: userId,
        email: currentUserLogin.emailAddresses[0].emailAddress,
        name: currentUserLogin.firstName,
      },
    });
  }
};
