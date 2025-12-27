import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export const createAboutStyles = (colors, theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text.main,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    aboutBox: {
        backgroundColor: theme === 'dark' ? colors.background.card : colors.profile.card4,
        padding: 20,
        borderRadius: 20,
        marginBottom: 15, // Burayı daralttım (30 -> 15)
        borderWidth: theme === 'dark' ? 1 : 0,
        borderColor: colors.neutral.border,
    },
    aboutText: {
        fontSize: 14,
        color: theme === 'dark' ? colors.text.secondary : colors.primary.main,
        lineHeight: 22,
        textAlign: 'justify', // METİN İKİ YANA YASLANDI
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: 10, // Burayı daralttım (20 -> 10)
    },
    teamGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 5, // Kartları biraz daha yukarı çekmek için eklendi
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.background.card,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.neutral.border,
        elevation: 2,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: colors.primary.light,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary.main,
        textAlign: 'center',
    },
    role: {
        fontSize: 12,
        color: colors.text.main,
        marginTop: 4,
        fontWeight: '600',
    },
    socialRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 12,
    },
    socialIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.neutral.input,
        justifyContent: 'center',
        alignItems: 'center',
    }
});