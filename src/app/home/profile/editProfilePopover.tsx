'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import axios from 'axios';

const EditProfilePopover: React.FC<{
  name: string;
  email: string;
  onSave: (name: string) => void;
}> = ({ name, email, onSave }) => {
  const [newName, setNewName] = useState(name);
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    axios.post('/api/profile/update', { name: newName, email, password: newPassword });

    onSave(newName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 sm:mt-0">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96 p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} className="w-full mt-4">
            Save Changes
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-full mt-2">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfilePopover;
