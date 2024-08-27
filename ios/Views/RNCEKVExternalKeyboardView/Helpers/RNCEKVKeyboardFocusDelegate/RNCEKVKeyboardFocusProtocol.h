//
//  RNCEKVKeyboardFocusProtocol.h
//  Pods
//
//  Created by Artur Kalach on 26/08/2024.
//

#ifndef RNCEKVKeyboardFocusProtocol_h
#define RNCEKVKeyboardFocusProtocol_h

#import <UIKit/UIKit.h>

@protocol RNCEKVKeyboardFocusProtocol <NSObject>
- (NSNumber *)isHaloActive;
- (NSString *) getFocusGroupIdentifier;
@end

#endif /* RNCEKVKeyboardFocusProtocol_h */
