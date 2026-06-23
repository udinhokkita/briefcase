import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, shadow } from '../theme/colors';
import { useStore, useT } from '../store/useStore';
import { RootStackParamList, TabParamList } from './types';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { TournamentsScreen } from '../screens/TournamentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { PlayerDetailScreen } from '../screens/PlayerDetailScreen';
import { TournamentDetailScreen } from '../screens/TournamentDetailScreen';
import { CreateTournamentScreen } from '../screens/CreateTournamentScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { TrialRequestScreen } from '../screens/TrialRequestScreen';
import { ReportScoreScreen } from '../screens/ReportScoreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Discover: 'search',
  Tournaments: 'trophy',
  Profile: 'briefcase',
  Notifications: 'notifications',
};

const MainTabs: React.FC = () => {
  const t = useT();
  const labels: Record<keyof TabParamList, string> = {
    Home: t('tab_home'),
    Discover: t('tab_discover'),
    Tournaments: t('tab_tournaments'),
    Profile: t('tab_profile'),
    Notifications: t('tab_notifications'),
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.hairline,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          ...shadow.medium,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.2 },
        tabBarLabel: labels[route.name],
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? TAB_ICONS[route.name] : (`${TAB_ICONS[route.name]}-outline` as keyof typeof Ionicons.glyphMap)} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const onboarded = useStore((s) => s.onboarded);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      {!onboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} />
          <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
          <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="TrialRequest" component={TrialRequestScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="ReportScore" component={ReportScoreScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
