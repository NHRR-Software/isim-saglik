import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ReportItem = ({ item, isExpanded, onToggle, styles, colors }) => {
    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity 
                style={styles.cardHeader} 
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.neutral.input }]}>
                    <Image source={item.icon} style={styles.reportIcon} />
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportSub}>{item.subtitle}</Text>
                </View>

                <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={colors.primary.main} 
                />
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.contentBody}>
                    {item.details.map((detail, index) => (
                        <View key={index} style={styles.bulletRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.bulletText}>{detail}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default ReportItem;