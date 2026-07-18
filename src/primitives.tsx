import React, { CSSProperties, ReactNode, useEffect } from 'react';

export type StyleProp = Record<string, any> | undefined | null | (Record<string, any> | undefined | null)[];

export class StyleSheet {
  static create<T extends Record<string, CSSProperties>>(styles: T): T { return styles; }
}

function flatten(styles: StyleProp): CSSProperties {
  if (!styles) return {};
  if (Array.isArray(styles)) {
    return styles.reduce((acc, s) => ({ ...acc, ...flatten(s as StyleProp) }), {});
  }
  const result: CSSProperties = {};
  for (const key in styles) {
    const val = (styles as Record<string, any>)[key];
    if (val == null) continue;
    if (key === 'flexDirection') result.flexDirection = val;
    else if (key === 'alignItems') result.alignItems = val;
    else if (key === 'justifyContent') result.justifyContent = val;
    else if (key === 'flex') result.flex = val;
    else if (key === 'flexWrap') result.flexWrap = val;
    else if (key === 'paddingHorizontal') { result.paddingLeft = val; result.paddingRight = val; }
    else if (key === 'paddingVertical') { result.paddingTop = val; result.paddingBottom = val; }
    else if (key === 'marginHorizontal') { result.marginLeft = val; result.marginRight = val; }
    else if (key === 'marginVertical') { result.marginTop = val; result.marginBottom = val; }
    else if (key === 'shadowColor') { (result as any)['--shadow-color'] = val; }
    else if (key === 'shadowOpacity') { (result as any)['--shadow-opacity'] = String(val); }
    else if (key === 'shadowRadius') { (result as any)['--shadow-radius'] = `${val}px`; }
    else if (key === 'shadowOffset') { (result as any)['--shadow-offset-x'] = `${val.width}px`; (result as any)['--shadow-offset-y'] = `${val.height}px`; }
    else if (key === 'elevation') { result.boxShadow = `0 ${Number(val) * 2}px ${Number(val) * 4}px rgba(0,0,0,0.15)`; }
    else if (key === 'textAlignVertical') { result.verticalAlign = val === 'top' ? 'top' : 'middle'; }
    else if (key === 'numberOfLines') { continue; }
    else if (key === 'textTransform') { result.textTransform = val; }
    else if (key === 'fontFamily') { result.fontFamily = val; }
    else (result as any)[key] = val;
  }
  return result;
}

function resolveBoxShadow(style: CSSProperties): CSSProperties {
  const sc = (style as any)['--shadow-color'] || '#000';
  const so = (style as any)['--shadow-opacity'] || '0.1';
  const sr = (style as any)['--shadow-radius'] || '0px';
  const sx = (style as any)['--shadow-offset-x'] || '0px';
  const sy = (style as any)['--shadow-offset-y'] || '0px';
  if (sc || so) {
    const shadow = `${sx} ${sy} ${sr} rgba(${hexToRgb(sc)}, ${so})`;
    return { ...style, boxShadow: (style as any).boxShadow || shadow };
  }
  return style;
}

function hexToRgb(hex: string): string {
  if (hex.startsWith('rgb')) return hex.replace(/rgba?\(|\)/g, '').split(',').slice(0, 3).join(',').trim();
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

interface ViewProps {
  style?: StyleProp;
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export const View = React.forwardRef<HTMLDivElement, ViewProps>(({ style, children, className, ...rest }, ref) => {
  const s = resolveBoxShadow(flatten(style));
  return <div ref={ref} className={className} style={s} {...rest}>{children}</div>;
});
View.displayName = 'View';

interface TextProps {
  style?: StyleProp;
  children?: ReactNode;
  numberOfLines?: number;
  [key: string]: any;
}

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(({ style, children, numberOfLines, ...rest }, ref) => {
  const s = flatten(style);
  if (numberOfLines === 1) {
    s.display = 'block';
    s.overflow = 'hidden';
    s.textOverflow = 'ellipsis';
    s.whiteSpace = 'nowrap';
    s.maxWidth = '100%';
  }
  return <span ref={ref} style={s} {...rest}>{children}</span>;
});
Text.displayName = 'Text';

interface TouchableOpacityProps {
  style?: StyleProp;
  children?: ReactNode;
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
  [key: string]: any;
}

export const TouchableOpacity = React.forwardRef<HTMLButtonElement, TouchableOpacityProps>(
  ({ style, children, onPress, activeOpacity = 0.7, disabled, ...rest }, ref) => {
    const s = flatten(style);
    s.cursor = disabled ? 'default' : 'pointer';
    s.border = 'none';
    s.background = s.background || 'transparent';
    s.padding = s.padding || 0;
    s.opacity = disabled ? 0.5 : 1;
    return (
      <button
        ref={ref}
        style={s}
        onClick={disabled ? undefined : onPress}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
TouchableOpacity.displayName = 'TouchableOpacity';

interface TextInputProps {
  style?: StyleProp;
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: string;
  multiline?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  [key: string]: any;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ style, value, onChangeText, placeholder, placeholderTextColor, keyboardType, multiline, maxLength, autoFocus, ...rest }, ref) => {
    const s = flatten(style);
    s.border = s.border || 'none';
    s.outline = 'none';
    s.background = s.background || 'transparent';
    if (keyboardType === 'numeric') s.inputMode = 'numeric';
    if (multiline) {
      return (
        <textarea
          ref={ref as any}
          style={s}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onChange={(e) => onChangeText?.(e.target.value)}
          {...rest}
        />
      );
    }
    return (
      <input
        ref={ref}
        type="text"
        style={s}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onChange={(e) => onChangeText?.(e.target.value)}
        {...rest}
      />
    );
  },
);
TextInput.displayName = 'TextInput';

interface ScrollViewProps {
  style?: StyleProp;
  children?: ReactNode;
  contentContainerStyle?: StyleProp;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: string;
  [key: string]: any;
}

export const ScrollView = React.forwardRef<HTMLDivElement, ScrollViewProps>(
  ({ style, children, contentContainerStyle, showsVerticalScrollIndicator, ...rest }, ref) => {
    const s = flatten(style);
    // Native scroll for Android WebView: force overflow-y auto and a flex child that can grow.
    (s as any).overflowY = 'auto !important';
    s.overflowX = 'hidden';
    (s as any).WebkitOverflowScrolling = 'touch';
    if (showsVerticalScrollIndicator === false) s.scrollbarWidth = 'none';
    const cs = flatten(contentContainerStyle);
    // Inner wrapper must not shrink so it can exceed the viewport and trigger scroll.
    (cs as any).flexShrink = 0;
    (cs as any).minHeight = '100%';
    return (
      <div ref={ref} style={s} {...rest}>
        <div style={cs}>{children}</div>
      </div>
    );
  },
);
ScrollView.displayName = 'ScrollView';

interface FlatListProps<T> {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (info: { item: T; index: number }) => ReactNode;
  ListEmptyComponent?: ReactNode;
  contentContainerStyle?: StyleProp;
  style?: StyleProp;
  [key: string]: any;
}

export function FlatList<T>({ data, keyExtractor, renderItem, ListEmptyComponent, contentContainerStyle, style, ...rest }: FlatListProps<T>) {
  const s = flatten(style);
  (s as any).overflowY = 'auto !important';
  (s as any).WebkitOverflowScrolling = 'touch';
  const cs = flatten(contentContainerStyle);
  (cs as any).flexShrink = 0;
  (cs as any).minHeight = '100%';
  if (data.length === 0 && ListEmptyComponent) {
    return <div style={s} {...rest}><div style={cs}>{ListEmptyComponent}</div></div>;
  }
  return (
    <div style={s} {...rest}>
      <div style={cs}>
        {data.map((item, index) => (
          <div key={keyExtractor(item, index)}>{renderItem({ item, index })}</div>
        ))}
      </div>
    </div>
  );
}

interface SectionListProps<T> {
  sections: { title: string; data: T[]; type?: string }[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (info: { item: T; index: number; section: { title: string; data: T[]; type?: string } }) => ReactNode;
  renderSectionHeader: (info: { section: { title: string; data: T[]; type?: string } }) => ReactNode;
  ListEmptyComponent?: ReactNode;
  contentContainerStyle?: StyleProp;
  style?: StyleProp;
  [key: string]: any;
}

export function SectionList<T>({ sections, keyExtractor, renderItem, renderSectionHeader, ListEmptyComponent, contentContainerStyle, style, ...rest }: SectionListProps<T>) {
  const s = flatten(style);
  (s as any).overflowY = 'auto !important';
  (s as any).WebkitOverflowScrolling = 'touch';
  const cs = flatten(contentContainerStyle);
  (cs as any).flexShrink = 0;
  (cs as any).minHeight = '100%';
  const totalItems = sections.reduce((sum, sec) => sum + sec.data.length, 0);
  if (totalItems === 0 && ListEmptyComponent) {
    return <div style={s} {...rest}><div style={cs}>{ListEmptyComponent}</div></div>;
  }
  return (
    <div style={s} {...rest}>
      <div style={cs}>
        {sections.map((section, si) => (
          <div key={`section-${si}`}>
            {renderSectionHeader({ section })}
            {section.data.map((item, index) => (
              <div key={keyExtractor(item, index)}>{renderItem({ item, index, section })}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ModalProps {
  visible: boolean;
  children: ReactNode;
  transparent?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  onRequestClose?: () => void;
}

export function Modal({ visible, children, transparent, animationType, onRequestClose }: ModalProps) {
  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        background: transparent ? 'rgba(15, 23, 42, 0.5)' : '#fff',
        animation: animationType === 'fade' ? 'fadeIn 0.2s ease' : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function ActivityIndicator({ size, color }: { size?: 'small' | 'large'; color?: string }) {
  const dim = size === 'large' ? 32 : 20;
  return (
    <div
      style={{
        width: dim,
        height: dim,
        border: `${dim / 8}px solid ${color || '#2563EB'}33`,
        borderTopColor: color || '#2563EB',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

export const Platform = {
  OS: 'web' as const,
  select: (obj: { web?: any; native?: any; ios?: any; android?: any }) => obj.web ?? obj.native ?? undefined,
};

export function KeyboardAvoidingView({ children, style, behavior, ...rest }: { children: ReactNode; style?: StyleProp; behavior?: string; [key: string]: any }) {
  const s = flatten(style);
  return <div style={s} {...rest}>{children}</div>;
}

export const Share = {
  async share(opts: { message: string; title?: string }) {
    if (navigator.share) {
      try { await navigator.share({ text: opts.message, title: opts.title }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(opts.message);
        alert('Datos copiados al portapapeles');
      } catch {
        alert('No se pudieron exportar los datos');
      }
    }
  },
};

export class Alert {
  static alert(title: string, message?: string | (() => void), buttons?: { text: string; style?: string; onPress?: () => void }[]) {
    if (typeof message === 'function') {
      buttons = message as any;
      message = undefined;
    }
    if (!buttons || buttons.length === 0) {
      window.alert(title + (message ? '\n\n' + message : ''));
      return;
    }
    const choice = window.confirm(message ? `${title}\n\n${message}` : title);
    if (choice) {
      const okBtn = buttons.find(b => b.style === 'destructive' || b.text.toLowerCase() === 'ok' || b.text.toLowerCase() === 'eliminar' || b.text.toLowerCase() === 'borrar' || b.text.toLowerCase() === 'restaurar');
      okBtn?.onPress?.();
    } else {
      const cancelBtn = buttons.find(b => b.style === 'cancel' || b.text.toLowerCase() === 'cancelar');
      cancelBtn?.onPress?.();
    }
  }
}
