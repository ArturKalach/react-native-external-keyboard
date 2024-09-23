//
//  RNCEKVPreferredFocusEnvironment.h
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 14/08/2024.
//

#ifndef RNCEKVPreferredFocusEnvironment_h
#define RNCEKVPreferredFocusEnvironment_h

@interface RNCEKVPreferredFocusEnvironment : NSObject

+ (instancetype)sharedInstance;

- (void)storeRootView:(NSString*)viewId withView:(UIView*) view;
- (void)detachRootView:(NSString*)viewId;
- (void)focus:(UIView*)view withRootId:(NSString*)rootId;
- (void)setAutoFocus:(UIView*)view withRootId:(NSString*)rootId;

@end

#endif /* RNCEKVPreferredFocusEnvironment_h */
