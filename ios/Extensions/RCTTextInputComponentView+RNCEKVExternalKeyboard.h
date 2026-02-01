//
//  RCTTextInputComponentView+RNCEKVExternalKeyboard.h
//  Pods
//
//  Created by Artur Kalach on 14/11/2024.
//

#ifndef RCTTextInputComponentView_RNCEKVExternalKeyboard_h
#define RCTTextInputComponentView_RNCEKVExternalKeyboard_h
#import <React/RCTBackedTextInputViewProtocol.h>
#import <React/RCTTextInputComponentView.h>

@interface RCTTextInputComponentView (RNCEKVExternalKeyboard)

@property (nonatomic, readonly) UIView* rncekbBackedTextInputView;

@end

#endif /* RCTTextInputComponentView_RNCEKVExternalKeyboard_h */
