//
//  KeyboardKeyPressHandler.h
//  ExternalKeyboard
//
//  Created by Artur Kalach on 21.06.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#ifndef KeyboardKeyPressHandler_h
#define KeyboardKeyPressHandler_h

@interface KeyboardKeyPressHandler:NSObject {
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
