import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    variant = 'primary',
    disabled = false,
}) => {
    const getButtonStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                };
            case 'secondary':
                return {
                    backgroundColor: Colors.secondary,
                    borderColor: Colors.secondary,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: Colors.primary,
                    borderWidth: 1,
                };
            case 'danger':
                return {
                    backgroundColor: Colors.danger,
                    borderColor: Colors.danger,
                };
            default:
                return {
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                };
        }
    };

    const getButtonTextStyles = () => {
        switch (variant) {
            case 'outline':
                return {
                    color: Colors.primary,
                };
            default:
                return {
                    color: Colors.text,
                };
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, getButtonStyles(), disabled && styles.disabledButton, style]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, getButtonTextStyles(), textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.6,
    },
});

export default Button;
