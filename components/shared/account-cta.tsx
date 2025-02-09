import { Pressable, Image } from "react-native";
import { useRouter } from "expo-router";

import images from "@/lib/images";

const AccountCTA = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/modal-screens/account-modal")}
      className={`rounded-full ${className}`}
    >
      <Image source={images.profile} className="size-8 rounded-full" />
    </Pressable>
  );
};

export default AccountCTA;
