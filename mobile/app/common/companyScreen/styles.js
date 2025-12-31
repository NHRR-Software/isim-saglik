import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

const createCompanyStyles = (colors, theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
    },
    headerBg: {
        height: 180,
        backgroundColor: theme === 'light' ? '#E7EFFF' : colors.background.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    profileContainer: {
        position: 'relative',
        marginTop: 20,
    },
    logoImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 5,
        borderColor: colors.background.default,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#FFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.neutral.border,
    },
    companyBadge: {
        backgroundColor: colors.primary.main,
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 15,
        marginTop: -15, 
        alignSelf: 'center',
        zIndex: 10,
    },
    companyName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 35,
        paddingBottom: 100,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoCard: {
        width: CARD_WIDTH,
        height: 115,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 15,
        marginTop: 10,
    },
    actionCardOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    actionIconContainer: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#FFF',
    },
    actionTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.text.main,
    },
    dropdownBody: {
        backgroundColor: theme === 'light' ? '#F8F9FB' : colors.neutral.input,
        padding: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        marginTop: -1, // Ayrık görüntüyü tamamen ortadan kaldırır
    },
    dropdownText: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 20,
        textAlign: 'justify',
    }
});

export default createCompanyStyles;