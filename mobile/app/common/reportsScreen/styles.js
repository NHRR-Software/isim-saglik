import { StyleSheet } from 'react-native';

export const createReportStyles = (colors, theme) => StyleSheet.create({
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
        paddingBottom: 100,
    },
    // Kart Yapısı
    cardWrapper: {
        backgroundColor: theme === 'light' ? '#F8F9FB' : colors.background.card,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme === 'light' ? '#F0F2F5' : colors.neutral.border,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    reportIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.main,
    },
    reportSub: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 2,
    },
    // Dropdown İçeriği
    contentBody: {
        padding: 20,
        backgroundColor: theme === 'light' ? '#FFFFFF' : colors.neutral.input,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border,
        margin: 10,
        borderRadius: 15,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        gap: 10,
    },
    bullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.main,
        marginTop: 6,
    },
    bulletText: {
        fontSize: 13,
        color: colors.text.main,
        lineHeight: 20,
        flex: 1,
        fontWeight: '500',
    }
});