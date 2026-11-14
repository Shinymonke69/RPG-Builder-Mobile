import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { CustomCard } from '../../components/CustomCard';
import { signUp, getAuthErrorMessage } from '../../features/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError('Informe seu nome de aventureiro.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signUp({
        email,
        password,
        name,
        passwordConfirmation: confirmPassword
      });

      Alert.alert(
        'Conta Criada!',
        'Sua conta foi criada no Firebase com sucesso. Você já está conectado.',
        [
          {
            text: 'Ir para o Início',
            onPress: () => router.replace('/(tabs)/home')
          },
          {
            text: 'Fazer Login',
            style: 'cancel',
            onPress: () => router.replace('/(auth)/sign-in')
          }
        ]
      );
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Nova Conta</Text>
            <Text style={styles.subtitle}>
              Junte-se ao RPG Builder para salvar e gerenciar suas fichas
            </Text>
          </View>

          <CustomCard>
            <CustomInput
              label="Nome de Jogador/Mestre"
              placeholder="Ex: Gabriel"
              autoCapitalize="words"
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (error) setError('');
              }}
            />

            <CustomInput
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (error) setError('');
              }}
            />

            <CustomInput
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (error) setError('');
              }}
            />

            <CustomInput
              label="Confirmar Senha"
              placeholder="Repita sua senha"
              secureTextEntry
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                if (error) setError('');
              }}
            />

            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <CustomButton
              title="Cadastrar e Entrar"
              loading={loading}
              icon={<Ionicons name="person-add-outline" size={20} color={colors.text} />}
              onPress={handleSignUp}
              style={styles.submitBtn}
            />
          </CustomCard>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444422',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1
  },
  submitBtn: {
    marginTop: 4
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryLight
  }
});
