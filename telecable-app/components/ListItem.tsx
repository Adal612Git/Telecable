import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface ListItemProps {
    title: string;
    description?: string;
    rightContent?: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    titleStyle?: TextStyle;
    descriptionStyle?: TextStyle;
}

const ListItem: React.FC<ListItemProps> = ({
    title,
    description,
    rightContent,
    onPress,
    style,
    titleStyle,
    descriptionStyle,
}) => {
    const content = (
        <View style={[styles.itemContainer, style]}>
            <View style={styles.textContainer}>
                <Text style={[styles.title, titleStyle]}>{title}</Text>
                {description && <Text style={[styles.description, descriptionStyle]}>{description}</Text>}
            </View>
            {rightContent && <View style={styles.rightContentContainer}>{rightContent}</View>}
        </View>
    );

    return onPress ? (
        <TouchableOpacity onPress={onPress}>
            {content}
        </TouchableOpacity>
    ) : (
        content
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    description: {
        fontSize: 13,
        color: Colors.muted,
        marginTop: 2,
    },
    rightContentContainer: {
        marginLeft: 10,
    },
});

export default ListItem;
