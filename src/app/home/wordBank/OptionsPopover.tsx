import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import DeleteWord from '../flashcards/learn/DeleteWord';
import EditWord from '../flashcards/learn/EditWord';

const OptionsPopoverContent = () => {

    const word = 'XD'
    return (

        <PopoverContent className="p-4 ml-4 rounded-lg shadow-md z-100">
            <div>
                <h1>Word: {word}</h1>
            </div>
            <div>
                <h2>Options</h2>
                <p>Here are some options for you to choose from.</p>
                <DeleteWord hardWord={word} />
                <EditWord wordData={word} />
            </div>
        </PopoverContent>
    );
};

export default OptionsPopoverContent;