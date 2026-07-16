import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { House, ChartPie, Tags, Settings } from 'lucide-react';
import { useTheme } from './lib/theme';
import { View, Text, StyleSheet, TouchableOpacity } from './primitives';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Categories from './pages/Categories';
import SettingsPage from './pages/Settings';
import Transaction from './pages/Transaction';
import CategoryEdit from './pages/CategoryEdit';

const TABS = [
  { path: '/', label: 'Inicio', icon: House },
  { path: '/stats', label: 'Estadísticas', icon: ChartPie },
  { path: '/categories', label: 'Categorías', icon: Tags },
  { path: '/settings', label: 'Ajustes', icon: Settings },
];

function TabBar() {
  const { colors } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isTabRoute = TABS.some((t) => t.path === location.pathname);
  if (!isTabRoute) return null;

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {TABS.map((tab) => {
        const active = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <TouchableOpacity key={tab.path} style={styles.tabItem} onPress={() => navigate(tab.path)}>
            <Icon size={22} color={active ? colors.primary : colors.tabInactive} strokeWidth={2} />
            <Text style={[styles.tabLabel, { color: active ? colors.primary : colors.tabInactive }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabLayout() {
  return (
    <View style={styles.tabLayout}>
      <View style={styles.content}>
        <Outlet />
      </View>
      <TabBar />
    </View>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TabLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/category-edit" element={<CategoryEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = StyleSheet.create({
  tabLayout: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
  },
});
