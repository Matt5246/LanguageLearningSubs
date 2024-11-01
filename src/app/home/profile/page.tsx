'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import EditProfilePopover from './editProfilePopover';
import {
    Key,
    Bell,
    Settings,
    Star,
    Clock,
    BookOpen,
    TrendingUp,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const ProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState({
        name: session?.user?.name,
        email: session?.user?.email,
    });
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleSaveProfile = (name: string, email: string) => {
        setProfile({ name, email });
    };
    return (
        <div className="container mx-auto p-8 space-y-8">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left space-y-1 flex-grow">
                        <CardTitle className="text-3xl font-bold">
                            {session?.user?.name}
                        </CardTitle>
                        <CardDescription>
                            {session?.user?.email}
                        </CardDescription>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                            <Badge variant="secondary">Premium Member</Badge>
                            <Badge variant="outline">Joined Mar 2024</Badge>
                        </div>
                    </div>
                    <EditProfilePopover
                        name={profile.name ?? ''}
                        email={profile.email ?? ''}
                        onSave={handleSaveProfile}
                    />
                    <Button className="mt-4 sm:mt-0" onClick={() => signOut()}>
                        Sign Out
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Anime Watched
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">247</div>
                                <p className="text-xs text-muted-foreground">
                                    +23% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Episodes Watched
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,345</div>
                                <p className="text-xs text-muted-foreground">
                                    +5% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Learning Streak
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">14 days</div>
                                <Progress value={70} className="mt-2" />
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="favorites">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    <TabsTrigger value="history">Watch History</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="favorites" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Favorite Anime</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['Naruto', 'One Piece', 'Attack on Titan'].map((anime) => (
                            <Card key={anime}>
                                <CardHeader>
                                    <CardTitle>{anime}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span>Episodes Watched:</span>
                                        <Badge>
                                            {anime === 'One Piece'
                                                ? '1000+'
                                                : anime === 'Naruto'
                                                    ? '220'
                                                    : '75'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <Star className="h-4 w-4 text-yellow-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Watch History</h2>
                    <div className="space-y-4">
                        {['My Hero Academia', 'Demon Slayer', 'Jujutsu Kaisen'].map(
                            (anime) => (
                                <Card key={anime}>
                                    <CardHeader>
                                        <CardTitle>{anime}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <span>Last Watched:</span>
                                            <Badge variant="outline">
                                                Episode{' '}
                                                {anime === 'My Hero Academia'
                                                    ? '88'
                                                    : anime === 'Demon Slayer'
                                                        ? '26'
                                                        : '24'}
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={
                                                anime === 'My Hero Academia'
                                                    ? 80
                                                    : anime === 'Demon Slayer'
                                                        ? 60
                                                        : 40
                                            }
                                            className="mt-2"
                                        />
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Account Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full">
                            <Key className="mr-2 h-4 w-4" /> Change Password
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Bell className="mr-2 h-4 w-4" /> Notification Preferences
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Settings className="mr-2 h-4 w-4" /> Language Settings
                        </Button>
                        <Button variant="outline" className="w-full text-destructive">
                            Delete Account
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;
