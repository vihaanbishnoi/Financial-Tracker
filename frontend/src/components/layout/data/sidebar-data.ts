import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  PiggyBank,
  ListTodo,
} from 'lucide-react'
// import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  // teams: [
  //   {
  //     name: 'Shadcn Admin',
  //     logo: Command,
  //     plan: 'Vite + ShadcnUI',
  //   },
  //   {
  //     name: 'Acme Inc',
  //     logo: GalleryVerticalEnd,
  //     plan: 'Enterprise',
  //   },
  //   {
  //     name: 'Acme Corp.',
  //     logo: AudioWaveform,
  //     plan: 'Startup',
  //   },
  // ],
  teams: [],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Transactions',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Budget Planning',
          url: '/budget',
          icon: PiggyBank,
        },
        {
          title: 'Analysis and Forecasting',
          url: '/users',
          icon: Users,
        },
        {
          title: 'AI Chatbot',
          url: '/chats',
          icon: MessagesSquare,
        },
      ],
    },
  ],
}
