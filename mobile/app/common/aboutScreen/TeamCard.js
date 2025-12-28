// app/common/aboutScreen/TeamCard.js
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';

const TeamCard = ({ item, styles, colors }) => {
    
    const openLink = (url) => {
        if(url) Linking.openURL(url);
    };

    return (
        <View style={styles.card}>
            <Image source={item.image} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
            
            <View style={styles.socialRow}>
                <TouchableOpacity 
                    onPress={() => openLink(item.github)}
                    style={styles.socialIcon}
                >
                    <AntDesign name="github" size={18} color={colors.primary.main} />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => openLink(item.linkedin)}
                    style={styles.socialIcon}
                >
                    <FontAwesome name="linkedin" size={18} color={colors.primary.main} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TeamCard;