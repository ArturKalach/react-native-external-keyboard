//
//  RNCEKVFocusProtocol.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVFocusProtocol_h
#define RNCEKVFocusProtocol_h

#import <UIKit/UIKit.h>

@protocol RNCEKVFocusProtocol <NSObject>
- (BOOL)canBeFocused;
- (BOOL)isGroup;
@end

#endif /* RNCEKVFocusProtocol_h */
