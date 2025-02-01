//
//  RNCEKVFocusDelegate.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVFocusDelegate_h
#define RNCEKVFocusDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVFocusProtocol.h"

@interface RNCEKVFocusDelegate : NSObject

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusProtocol> *_Nonnull)view;

- (UIView*_Nonnull)getFocusingView;
- (BOOL)canBecomeFocused;
- (nullable NSNumber*)isFocusChanged:(UIFocusUpdateContext *)context;

@end


#endif /* RNCEKVFocusDelegate_h */
