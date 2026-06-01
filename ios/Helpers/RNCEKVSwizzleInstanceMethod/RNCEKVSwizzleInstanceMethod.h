//
//  RNCEKVSwizzleInstanceMethod.h
//  Pods
//
//  Created by Artur Kalach on 12/08/2025.
//

#ifndef RNCEKVSwizzleInstanceMethod_h
#define RNCEKVSwizzleInstanceMethod_h

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

void RNCEKVSwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector);

#define RNCEKV_CONCAT_INNER(a, b) a##b
#define RNCEKV_CONCAT(a, b) RNCEKV_CONCAT_INNER(a, b)

#ifdef RCT_DYNAMIC_FRAMEWORKS

#define RNCEKV_INSTALL_SWIZZLES(registerFn)                                    \
  __attribute__((constructor))                                                 \
  static void RNCEKV_CONCAT(RNCEKVInstall_, registerFn)(void) { registerFn(); }

#else

#define RNCEKV_INSTALL_SWIZZLES(registerFn)                                    \
  + (void)load {                                                               \
    static dispatch_once_t RNCEKV_CONCAT(once_, registerFn);                   \
    dispatch_once(&RNCEKV_CONCAT(once_, registerFn), ^{ registerFn(); });      \
  }

#endif

#endif /* RNCEKVSwizzleInstanceMethod_h */
