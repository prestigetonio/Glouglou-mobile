import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Bottle, BottleFormData, WINE_TYPE_CONFIG, WINE_TYPES, WineType } from '@/lib/types';
import StarRating from './StarRating';

interface Props {
  initial?: Bottle;
  onSubmit: (data: BottleFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function toFormData(b?: Bottle): BottleFormData {
  if (!b) {
    return {
      name: '',
      domain: '',
      type: 'Rouge',
      vintage: '',
      year: String(new Date().getFullYear()),
      region: '',
      country: '',
      quantity: '1',
      price: '',
      rating: null,
      notes: '',
    };
  }
  return {
    name: b.name,
    domain: b.domain,
    type: b.type,
    vintage: b.vintage ? String(b.vintage) : '',
    year: String(b.year),
    region: b.region ?? '',
    country: b.country ?? '',
    quantity: String(b.quantity),
    price: b.price != null ? String(b.price) : '',
    rating: b.rating,
    notes: b.notes ?? '',
  };
}

export default function BottleForm({ initial, onSubmit, onCancel, submitLabel = 'Enregistrer' }: Props) {
  const [form, setForm] = useState<BottleFormData>(() => toFormData(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BottleFormData>(key: K, val: BottleFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError('Le nom est requis'); return; }
    if (!form.domain.trim()) { setError('Le domaine est requis'); return; }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F7F3EE' }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type selector */}
        <Label>Type de vin</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {WINE_TYPES.map((t) => {
            const cfg = WINE_TYPE_CONFIG[t];
            const selected = form.type === t;
            return (
              <Pressable
                key={t}
                onPress={() => set('type', t)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selected ? cfg.bg : '#F2EDE6',
                  borderWidth: selected ? 1.5 : 1,
                  borderColor: selected ? cfg.text : '#C8BAA8',
                }}
              >
                <Text style={{ fontSize: 14 }}>{cfg.icon}</Text>
                <Text style={{ fontSize: 13, color: selected ? cfg.text : '#7A6E65', fontWeight: selected ? '600' : '400' }}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Row: Nom + Domaine */}
        <Row>
          <FieldGroup label="Nom *" style={{ flex: 1 }}>
            <Input
              value={form.name}
              onChangeText={(v) => set('name', v)}
              placeholder="Château Margaux"
              autoCapitalize="words"
            />
          </FieldGroup>
          <FieldGroup label="Domaine *" style={{ flex: 1 }}>
            <Input
              value={form.domain}
              onChangeText={(v) => set('domain', v)}
              placeholder="Château Margaux"
              autoCapitalize="words"
            />
          </FieldGroup>
        </Row>

        {/* Row: Millésime + Année d'achat */}
        <Row>
          <FieldGroup label="Millésime" style={{ flex: 1 }}>
            <Input
              value={form.vintage}
              onChangeText={(v) => set('vintage', v)}
              placeholder="2018"
              keyboardType="number-pad"
              maxLength={4}
            />
          </FieldGroup>
          <FieldGroup label="Année d'achat *" style={{ flex: 1 }}>
            <Input
              value={form.year}
              onChangeText={(v) => set('year', v)}
              placeholder={String(new Date().getFullYear())}
              keyboardType="number-pad"
              maxLength={4}
            />
          </FieldGroup>
        </Row>

        {/* Row: Quantité seule */}
        <FieldGroup label="Quantité">
          <Input
            value={form.quantity}
            onChangeText={(v) => set('quantity', v)}
            placeholder="1"
            keyboardType="number-pad"
          />
        </FieldGroup>

        {/* Row: Région + Pays */}
        <Row>
          <FieldGroup label="Région" style={{ flex: 1 }}>
            <Input
              value={form.region}
              onChangeText={(v) => set('region', v)}
              placeholder="Bordeaux"
              autoCapitalize="words"
            />
          </FieldGroup>
          <FieldGroup label="Pays" style={{ flex: 1 }}>
            <Input
              value={form.country}
              onChangeText={(v) => set('country', v)}
              placeholder="France"
              autoCapitalize="words"
            />
          </FieldGroup>
        </Row>

        {/* Prix */}
        <FieldGroup label="Prix (€)">
          <Input
            value={form.price}
            onChangeText={(v) => set('price', v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </FieldGroup>

        {/* Note */}
        <FieldGroup label="Note">
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
            <StarRating
              value={form.rating}
              onChange={(v) => set('rating', form.rating === v ? null : v)}
              size="lg"
            />
            {form.rating && (
              <Pressable onPress={() => set('rating', null)} style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: '#9E9189' }}>Effacer</Text>
              </Pressable>
            )}
          </View>
        </FieldGroup>

        {/* Notes */}
        <FieldGroup label="Notes personnelles">
          <TextInput
            value={form.notes}
            onChangeText={(v) => set('notes', v)}
            placeholder="Arômes, accords mets-vins…"
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#C8BAA8',
              borderRadius: 8,
              padding: 12,
              fontSize: 15,
              color: '#1C1410',
              minHeight: 80,
              textAlignVertical: 'top',
            }}
          />
        </FieldGroup>

        {error && (
          <Text style={{ color: '#991B1B', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
            {error}
          </Text>
        )}

        {/* Boutons */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={onCancel}
            style={{ flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#C8BAA8', alignItems: 'center' }}
          >
            <Text style={{ color: '#7A6E65', fontSize: 15, fontWeight: '500' }}>Annuler</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => ({
              flex: 2,
              padding: 14,
              borderRadius: 10,
              backgroundColor: pressed || loading ? '#991B1B' : '#7A1515',
              alignItems: 'center',
            })}
          >
            {loading
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>{submitLabel}</Text>
            }
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: '600', color: '#7A6E65', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {children}
    </Text>
  );
}

function FieldGroup({ label, children, style }: { label: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Label>{label}</Label>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {children}
    </View>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  maxLength,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'number-pad' | 'decimal-pad' | 'default';
  autoCapitalize?: 'words' | 'none' | 'sentences';
  maxLength?: number;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9E9189"
      keyboardType={keyboardType ?? 'default'}
      autoCapitalize={autoCapitalize ?? 'none'}
      maxLength={maxLength}
      style={{
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#C8BAA8',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: '#1C1410',
      }}
    />
  );
}
