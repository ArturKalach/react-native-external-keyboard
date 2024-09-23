//
//  KeyboardKeyPressHandler.h
//  ExternalKeyboard
//
//  Created by Artur Kalach on 21.06.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#ifndef RNCEKVKeyboardKeyPressHandler_h
#define RNCEKVKeyboardKeyPressHandler_h

@interface RNCEKVKeyboardKeyPressHandler:NSObject {
    NSMutableDictionary* _keyPressedTimestamps;
}

-(NSDictionary*) getKeyPressEventInfo:(NSSet<UIPress *> *)presses
                            withEvent:(UIPressesEvent *)event;

-(NSDictionary*) actionDownHandler:(NSSet<UIPress *> *)presses
                         withEvent:(UIPressesEvent *)event;

-(NSDictionary*) actionUpHandler:(NSSet<UIPress *> *)presses
                       withEvent:(UIPressesEvent *)event;

@end

#endif /* KeyboardKeyPressHandler_h */
