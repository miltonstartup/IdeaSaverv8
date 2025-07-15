'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/use-auth';
import LoadingSpinner from '@/src/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ListFilter, Trash2, Edit, Share2, Play, ChevronDown, MessageSquare, Mic as LucideMic } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { AudioRecording } from '@/src/types';
import { loadRecordingsLocally, deleteRecordingLocally } from '@/src/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function HistoryPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [notes, setNotes] = useState<AudioRecording[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // --- Defensive loading and authentication check ---
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('HistoryPage: Not authenticated, redirecting to /login...');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // --- Load notes from local storage ---
  useEffect(() => {
    if (user && profile && !isLoading) {
      try {
        const userNotes = loadRecordingsLocally(user.id);
        setNotes(userNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error loading recordings:', error);
        toast({
          title: "Failed to load notes",
          description: "There was an error loading your saved notes.",
          variant: "destructive"
        });
      }
    }
  }, [user, profile, isLoading, toast]);

  // --- Function to handle note deletion ---
  const handleDeleteNote = (noteId: string) => {
    if (!user) return;
    
    try {
      deleteRecordingLocally(user.id, noteId);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      toast({ 
        title: "Note Deleted", 
        description: "The note has been removed from your device." 
      });
      // TODO: If Cloud Sync is enabled, also delete from Supabase
    } catch (error) {
      console.error("Error deleting note locally:", error);
      toast({ 
        title: "Deletion Failed", 
        description: "Could not delete the note.", 
        variant: "destructive" 
      });
    }
  };

  // --- Function to handle editing note (placeholder) ---
  const handleEditNote = (noteId: string) => {
    // This would open a modal or navigate to an edit page
    toast({ 
      title: "Coming Soon!", 
      description: "Note editing is under development." 
    });
  };

  // --- Function to handle playing audio (placeholder) ---
  const handlePlayAudio = (audioDataUri: string | undefined) => {
    if (audioDataUri) {
      const audio = new Audio(audioDataUri);
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        toast({ 
          title: "Playback Error", 
          description: "Could not play the audio recording.", 
          variant: "destructive" 
        });
      });
    } else {
      toast({ 
        title: "No Audio", 
        description: "Audio data not available for this note." 
      });
    }
  };

  // Filtered notes logic (basic search)
  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.transcription && note.transcription.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (note.summary && note.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading || !user || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-primary-bg text-dark-text-light">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-dark-text-muted">Loading history...</p>
        </div>
      </div>
    );
  }

  // --- Main History Page Content ---
  return (
    <div className="min-h-screen bg-dark-primary-bg text-dark-text-light py-10 px-4 flex flex-col items-center">
      <div className="text-center mb-10 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-2 gradient-text">History & Notes</h1>
        <p className="text-dark-text-muted text-lg mb-6">
          Search, sort, and manage your past recordings.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-xl">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
          <Input 
            placeholder="Search by title, summary, or content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-dark-secondary-bg border-dark-border-subtle text-dark-text-light placeholder-dark-text-muted rounded-lg" 
          />
        </div>
        <Button 
          className="bg-accent-purple text-dark-text-light rounded-lg hover:opacity-90 transition-opacity"
          onClick={() => toast({ 
            title: "Coming Soon!", 
            description: "Advanced filtering is under development." 
          })}
        >
          <ListFilter className="w-5 h-5 mr-2" /> Filter
        </Button>
      </div>

      {/* Notes List */}
      <div className="w-full max-w-xl space-y-4">
        {filteredNotes.length === 0 ? (
          <Card className="bg-dark-secondary-bg border-dark-border-subtle rounded-xl shadow-lg">
            <CardContent className="p-12 text-center">
              <LucideMic className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-text-light mb-2">No notes yet</h3>
              <p className="text-dark-text-muted mb-6">
                Start recording your ideas to see them here
              </p>
              <Button 
                className="btn-gradient"
                onClick={() => router.push('/record')}
              >
                Record Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} className="bg-dark-secondary-bg border-dark-border-subtle rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-dark-text-light text-lg mb-1">{note.name}</CardTitle>
                <CardDescription className="text-dark-text-muted">
                  {note.date ? format(new Date(note.date), 'MMMM d, yyyy HH:mm') : 'Unknown date'} • {note.duration}s
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {note.transcription && (
                  <Collapsible className="rounded-md border border-dark-border-subtle p-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-dark-text-light font-semibold text-left">
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Transcription
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="text-dark-text-muted mt-2 pt-2 border-t border-dark-border-subtle">
                      <p className="text-sm leading-relaxed">{note.transcription}</p>
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                {note.summary && (
                  <Collapsible className="rounded-md border border-dark-border-subtle p-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-dark-text-light font-semibold text-left">
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Summary
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="text-dark-text-muted mt-2 pt-2 border-t border-dark-border-subtle">
                      <p className="text-sm leading-relaxed">{note.summary}</p>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <div className="flex items-center justify-between text-dark-text-muted text-sm mt-4">
                  <div className="flex space-x-2">
                    {note.audioDataUri && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-dark-text-light hover:text-accent-purple" 
                        onClick={() => handlePlayAudio(note.audioDataUri)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-dark-text-light hover:text-accent-purple" 
                      onClick={() => handleEditNote(note.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-dark-text-light hover:text-accent-purple" 
                      onClick={() => toast({ 
                        title: "Coming Soon!", 
                        description: "Sharing options are under development." 
                      })}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-400" 
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}