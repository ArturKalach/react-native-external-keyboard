//
//  RNCEKVAutoFocus.h
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 17/08/2024.
//

#ifndef RNCEKVAutoFocus_h
#define RNCEKVAutoFocus_h

@interface RNCEKVAutoFocus : NSObject

+ (instancetype)sharedInstance;

@property (nonatomic, strong) UIView *focusView;

@end


#endif /* RNCEKVAutoFocus_h */
