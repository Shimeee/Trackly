import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Row, Divider } from '../../components/Row';
import { Toggle } from '../../components/Toggle';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';

function ToggleRow({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{label}</Text>
        {sub ? <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

export function PrivacySecurityScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <Screen>
      <ScreenHeader title={t('privacySecurity.title')} />

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('privacySecurity.sectionSecurity')}</Text>
      <Card>
        <Row label={t('privacySecurity.changePassword')} onPress={() => {}} />
        <Divider />
        <ToggleRow label={t('privacySecurity.twoFactor')} sub={t('privacySecurity.twoFactorSub')} value={twoFactor} onChange={setTwoFactor} />
        <Divider />
        <ToggleRow label={t('privacySecurity.biometric')} sub={t('privacySecurity.biometricSub')} value={biometric} onChange={setBiometric} />
      </Card>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('privacySecurity.sectionData')}</Text>
      <Card>
        <ToggleRow label={t('privacySecurity.dataSharing')} sub={t('privacySecurity.dataSharingSub')} value={dataSharing} onChange={setDataSharing} />
        <Divider />
        <ToggleRow label={t('privacySecurity.analytics')} sub={t('privacySecurity.analyticsSub')} value={analytics} onChange={setAnalytics} />
      </Card>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('privacySecurity.sectionActiveSessions')}</Text>
      <Card>
        <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
          <Text style={[textType.body, { color: colors.textPrimary }]}>{t('privacySecurity.thisDevice')}</Text>
          <Text style={[textType.caption, { color: colors.statusSuccess, marginTop: 2 }]}>{t('privacySecurity.activeNow')}</Text>
        </View>
      </Card>
    </Screen>
  );
}
