//
//  UIView+RNCEKVExternalKeyboard.h
//  Pods
//
//  Created by Artur Kalach on 12/08/2025.
//

#ifndef UIView_RNCEKVExternalKeyboard_h
#define UIView_RNCEKVExternalKeyboard_h


#ifdef RCT_NEW_ARCH_ENABLED
  #import <React/RCTViewComponentView.h>
  #define RNCEKVViewClass RCTViewComponentView
#else
  #import <React/RCTView.h>
  #define RNCEKVViewClass RCTView
#endif


@interface RNCEKVViewClass (RNCEKVExternalKeyboard)

@end


#endif /* UIView_RNCEKVExternalKeyboard_h */
