import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type Role = 'morador' | 'porteiro';

interface Props {
  selected: Role;
  onSelect: (role: Role) => void;
}

export function RoleToggle({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {(['morador', 'porteiro'] as Role[]).map((role) => (
        <TouchableOpacity
          key={role}
          style={[styles.option, selected === role && styles.optionActive]}
          onPress={() => onSelect(role)}
          activeOpacity={0.8}
        >
          <Text style={[styles.label, selected === role && styles.labelActive]}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  optionActive: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});