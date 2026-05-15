import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootTabParamList = {
  Accueil: undefined;
  Compte: undefined;
  Burn: undefined;
  Profile: undefined;
  Auth: undefined;
};

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type HomeScreenProps = RootTabScreenProps<"Accueil">;
export type AccountScreenProps = RootTabScreenProps<"Compte">;
export type BurnScreenProps = RootTabScreenProps<"Burn">;
export type ProfileScreenProps = RootTabScreenProps<"Profile">;
export type AuthScreenProps = RootTabScreenProps<"Auth">;
