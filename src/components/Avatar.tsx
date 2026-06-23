import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const Avatar: React.FC<{
  initials: string;
  color: string;
  size?: number;
  verified?: boolean;
}> = ({ initials, color, size = 56, verified }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '33', borderColor: color },
      ]}
    >
      <Text style={[styles.initials, { color, fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
    {verified && (
      <View style={[styles.badge, { right: -2, bottom: -2 }]}>
        <Ionicons name="checkmark-circle" size={size * 0.32} color={colors.blue} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  initials: { fontWeight: '800' },
  badge: {
    position: 'absolute',
    backgroundColor: colors.bg,
    borderRadius: 999,
  },
});
